# blissapplication
An app to connect to Bliss API

## Specifications
The app should comply with the specifications defined on the file [Specification](Specification.pdf).

#### FREQ-01: Loading Screen
- [x] Loading Screen while the Server Health is checked
- [x] Server Health OK: Proceed to List Screen
- [x] Server Health Not OK: Retry Action

#### FREQ-02: Questions List Screen
- [x] Show the list screen after contact and check the server health
- [x] Show the List Screen if the app was oppened directly from a compatible URL
- [x] Update the search box with the query parameter on the URL
- [x] Fetch 10 records at a time
- [x] Load 10 additional records if the user wants to
- [x] Search box to filter results
- [x] Clear button to reset filter
- [ ] Ability to share search results

### FREQ-03: Detail Screen
- [x] Show the detail screen when a row in the list is selected
- [x] Show the detail screen if the correct URL is accessed directly
- [x] Show all the information related with the object selected
- [x] The user can vote on a particular answer
- [ ] Share the detail screen

### FREQ04: Share Screen
- [ ] Allow the user to share the content via email

### FREQ05: Connectivity Screen
- [ ] Monitor connectivity and show a screen if the connection is lost
- [ ] Keep the connection lost screen visible until the connection is back
- [ ] When connection is back the user should be at the same state it was before


## Things to improve
- Error messages and Handling
- Improve server connection (maybe with something similar to singletons in PHP)
- Organize code and files
- Responsive Design

## How to use the app
You just need to download and deploy the files on the root of your host, no special configuration is needed.