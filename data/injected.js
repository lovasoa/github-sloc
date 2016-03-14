let regex = /^https:\/\/github.com\/([0-9A-Za-z\-_]*\/[0-9A-Za-z\-_]*)$/;
let match = document.URL.match(regex);
let description = document.querySelector(".repository-meta-content");

function format_num(number) {
  return number.toString()
          .split("").reverse().join("")
          .replace(/(\d{3})/g, "$1 ")
          .split("").reverse().join("");
}

function get_data(url, nbr_times) {
  //Github's API returns an empty object the first time it is accessed
  if (nbr_times === 0) return Promise.reject("Too many tries");
  return fetch(url)
    .then(response => response.json())
    .catch(err => get_data(url, nbr_times-1))
    .then(data => Array.isArray(data) ? data : get_data(url, nbr_times-1));
}

if (match !== null && description !== null) {
  let repo = match[1];
  let url = "https://api.github.com/repos/"+repo+"/stats/code_frequency";
  get_data(url, 5)
    .then(weeks => weeks.reduce(function(total, week) {
            total[0] += week[1];
            total[1] += week[2];
            return total;
        }, [0,0]))
    .then(sloc => description.textContent += ". " +
                                          format_num(sloc[0]+sloc[1]) +
                                          " SLOC " +
                                          "( +" + sloc[0] +
                                          " / " + sloc[1] +
                                          " )");
}
