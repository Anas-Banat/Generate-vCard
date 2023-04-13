// create the empty user object to update the user info
let userObj = {}

// gran the input in url with un parameter
const queryString = window.location.search;
const parameters = new URLSearchParams(queryString);
const userInputNameInUrl = parameters.get('un');

// grab the elements with ID selectors
let pageTitle = document.getElementById('pageTile');
let titleName = document.getElementById('titleName');
let roleName = document.getElementById('roleName');
let tel = document.getElementById('tel');
let mobile = document.getElementById('mobile');
let email = document.getElementById('email');

// below function will execute automatically and fetch the user info based on username input provided below
(function (userName) {
  console.log('userName', userName)
  if (!userName) {
    document.getElementById('cardLoading').innerHTML = 'Please Provide the User Information in URL!';
    return;
  }

  fetch(`https://prod-197.westeurope.logic.azure.com/workflows/e7715b7b5851441888347c2eb05f0fb7/triggers/manual/paths/invoke/User/${userName}?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6w3cc4Pdh2DCGUcJ1XtKYHPd2m14pUf9Qsq7ex5I0oQ`)
    .then(res => res.json())
    .then(user => {
      // assign user object to userObj variable for global access
      userObj = user;
      console.log(userObj);
      //pageTitle.innerHTML = userObj.displayName;
      titleName.innerHTML = `I'm ${userObj.displayName}`;
      roleName.innerHTML = `a ${userObj.jobTitle}`;

      tel.innerHTML = `☏ ${userObj.businessPhones[0]?.replace('-', '') || '00000000'}`;
      tel.setAttribute('href', `tel:${userObj.businessPhones[0]?.replace('-', '') || '00000000'}`);

      mobile.innerHTML = `✆ ${userObj.mobilePhone.replace('+974', '')}`;
      mobile.setAttribute('href', `tel:${userObj.mobilePhone.replace('+974', '')}`);

      email.innerHTML = `✉ ${userObj.mail}`;
      email.setAttribute('href', `mailto: ${userObj.mail}`);

      // display the info after rendering
      document.getElementById('cardBody').style.display = 'block';
      // hide the cardLoading after rendering
      document.getElementById('cardLoading').style.display = 'none';
    }).catch(error => {
      console.log(error);
      document.getElementById('cardLoading').innerHTML = 'No User Found!';
    });
})(userInputNameInUrl); // here provide the user name info from scanning app 


function generateVCard2() {
  // fill the below vCard information with fetched user response
  var vCard = `BEGIN:VCARD\nVERSION: 4.0\nFN:${userObj.displayName} \nTEL; TYPE = WORK, VOICE: ${userObj.businessPhones[0]} \nTEL; TYPE = CELL, VOICE: ${userObj.mobilePhone.replace('+974', '')} \nEMAIL; TYPE = PREF, INTERNET:${userObj.mail} \nEND: VCARD`;
  var data = "data:text/vcard;charset=utf-8," + encodeURIComponent(vCard);
  var a = document.createElement('a');
  a.href = data;
  a.download = "VCard.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}