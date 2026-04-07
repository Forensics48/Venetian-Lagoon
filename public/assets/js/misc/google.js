 
       
        const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
        const API_KEY = 'YOUR_GOOGLE_API_KEY';
  
        const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  
        const SCOPES = 'https://www.googleapis.com/auth/calendar';
  
        let tokenClient;
        let gapiInited = false;
        let gisInited = false;

        var startDate = '';
        var endDate = '';

        $('#bookings-table').on('click', '.btn',function(){
          var currentRow = $(this).closest("tr");
         startDate = currentRow.find("td:eq(1)").text().substring(0,10);
         endDate = currentRow.find("td:eq(1)").text().substring(13);
         addVacation();
        })

        document.getElementById('authorize_button').style.visibility = 'hidden';
        document.getElementById('signout_button').style.visibility = 'hidden';
  
        function gapiLoaded() {
          gapi.load('client', intializeGapiClient);
        }

        /**
         * Callback after the API client is loaded. Loads the
         * discovery doc to initialize the API.
         */
        async function intializeGapiClient() {
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          gapiInited = true;
          maybeEnableButtons();
        }
  
        /**
         * Callback after Google Identity Services are loaded.
         */
        function gisLoaded() {
          tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
          });
          gisInited = true;
         maybeEnableButtons();
        }
  
        /**
         * Enables user interaction after all libraries are loaded.
         */
         function maybeEnableButtons() {
          if (gapiInited && gisInited) {
            document.getElementById('authorize_button').style.visibility = 'visible';
          }
        }
  
        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick()  {

          tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
              throw (resp);
            }
           // document.getElementById('signout_button').style.visibility = 'visible';
           // document.getElementById('authorize_button').innerText = 'Refresh';
           // await listUpcomingEvents();
          };
  
          if (gapi.client.getToken() === null) {
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            tokenClient.requestAccessToken({prompt: 'consent'});
          } else {
            
            // Skip display of account chooser and consent dialog for an existing session.
            tokenClient.requestAccessToken({prompt: ''});
          }
        }
  
        /**
         *  Sign out the user upon button click.
         */
        function handleSignoutClick() {
          const token = gapi.client.getToken();
          if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            document.getElementById('content').innerText = '';
            document.getElementById('authorize_button').innerText = 'Authorize';
            document.getElementById('signout_button').style.visibility = 'hidden';
          }
        }

        async function addVacation() {

          summary = 'Ihr Urlaub in der venezianischen Lagune mit LagooD',
          description = 'Ihr Boating Guide für die Venezianische Lagune',
          start = {
              dateTime : '' + startDate.substring(6,10) +'-'+ startDate.substring(3,5) +'-'+ startDate.substring(0,2) +'T10:00:00-00:00',
            timeZone : 'Europe/Berlin',
          },
          end = {
            dateTime : '' + endDate.substring(6,10) +'-'+ endDate.substring(3,5) +'-'+ endDate.substring(0,2) +'T10:00:00-00:00',
            timeZone : 'Europe/Berlin',
          },

          console.log('try add event');

          var event = {
            'summary': summary,
            'location': '45° 26′ N , 12° 20′ O',
            'description': description,
            'start': start,
            'end': end,
        }

       var request =  gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
        });
        
       request.execute(function(event) {
          console.log(event);
        });
        }

        