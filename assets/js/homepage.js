var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function(e) {
    e.preventDefault();
    // get value for input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("please enter a GitHub username");
    }
};

var getUserRepos = function(user) {
    //github api url modifier
    var apiUrl = 'http://api.github.com/users/' + user + '/repos';

    // make request to modified url
    fetch(apiUrl)
    .then(function(response) {
        // request was a success
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: Github User Not Found");
        }
    })
    .catch(function(error) {
        // chained to .then
        alert("Unable to connect to GitHub");
    })
};

var displayRepos = function(repos, searchTerm) {
    // check if api retunred any repos
    if (repos.length === 0) {
        repoContainerEl.textContent= "No repositories found."
        return;
    }
    
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;
    
    // loop over repos
    for (var i=0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // apend to container
        repoEl.appendChild(titleEl);

        // create a staus element
        var statusEl = document.createElement('span');
        statusEl.classList = "flex-row align-center";

        // check if cuurent repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = 
                "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append container to dom
        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);
getUserRepos('user');