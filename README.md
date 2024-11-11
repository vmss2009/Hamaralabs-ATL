# Automation of experiential learning with customized, adaptable, and incremental path for skills acquisition.

## **Background**

Education provides knowledge. Knowledge transforms students by introducing skills. Skills
make students get employment. Experiential learning makes this process more intuitive.
Automating this experiential learning can streamline skills of students by making every
stakeholder accountable and responsive. Thus, we could pave the path for more Innovations,
skills, and employment.

HamaraLabs is an education technology platform automating experiential learning to bring it
in-practice to students. It starts with automating 10,000+ Atal Tinkering Labs (ATLs). ATLs are
set up by Atal Innovation Mission (AIM) of NITI-Aayog, Govt. of India. These are workspaces
in schools for students (6th to 12th class) to give shape to their ideas through hands-on do-it-
yourself mode and learn innovation skills. Further, HamaraLabs caters to non-ATL school
students making all stakeholders accountable to skill development process in students.

## **Salient features of web app/mobile app**

- ATL Team formation/ Roles assignment/ Components Identification & tracking
- ATL Tinkering activities workflow/tracking/documentation
- ATL in-charge task management
- ATL Student teams/Experiments/Skills/Innovations repository
- ATL capability dashboard with scores and grading
- ATL alumni handling
- ATL Vendor management & tool selection process
- Integration with existing AIM Mentor connect process
- Customised subsequent experiment assignment using Artificial Intelligence
- Experiment identification and assignment
- Competitions exploration/assignment with milestone tracking
- Student skills showcase
- Communications workflow for Students/Parents/teachers/Mentors etc
- Trainings Identification/offering & tracking
- In-school initiatives connect and customization
- Community school connection workflow and tracking
- Risk management
- Security management
- Partnership creation & management

## **User Profiles and their purpose of accessing web app/mobile app**

- ATL / non-ATL student - Actual student doing tinkering activity
- ATL/makerspace In-charge – In-charge of ATL lab helping students perform tinkering
  activities at ground level
- ATL Mentor of Change - Mentors appointed by Atal Innovation Mission or external
  mentors appointed by school management. They identify innovation areas and guide
  students.
- ATL Regional Mentors of Change - Regional mentors have to back fill mentors in
  some cases, guide mentors and identify best practices across ATL’s and implement
  them.
- ATL/makerspace principal/management - They need to know what is happening in
  ATL through school management dashboard.
- ATL partners - HEIs and government bodies/businesses who support ATL’s need to
  get reports on a timely basis.
- AIM Team - Get timely reports on setup, usage of ATL resources. compliance
  procedures, Monthly dashboards, Utilisation certificates, request for further funding
  etc
- AIM Management - Get score cards/rankings of ATL’s as per their functioning level,
  Innovations developed, community engagement, fund utilisation etc

## **Stakeholders and their concerns**

The complete list of all stakeholders is depicted in this diagram.


A sample list of concerns from End-user organization are depicted here:

## **Usage scenarios**

- ATL or makerspace setup in a school – during the initial setting up of
  ATL/makerspace
- ATL/makerspace Execution – during the functional execution of ATL/makerspace
  while students start doing tinkering activities
- ATL/makerspace partner connect – when ATL’s partner with Higher educational
  institutions, corporates government bodies etc
- ATL community programs - when ATL’s connect with non-ATL schools to perform
  community day programs
- Competitions – when ATL’s want their students participate in various competitions
  like ATL Tinkerpreneur, Marathon, Smart India hackathon etc


## **Sample workflow of an ATL executing student tinkering activities**

- Identify around 15 team leaders and add their student profiles
- Discuss with team leaders to understand their aspirations and thoughts. Update the
  same in their profiles and the platform suggests an initial experiment
- Give application access to team leaders so that they take ownership and upload their
  team members details
- Teams start collecting components by knowing each of the components from the
  component repository section, identify available components and knowing the
  availability of unavailable components from nearest/preferred ATL or vendor. ATL in-
  charge would handhold the process
- ATL Mentor to initiate discussion with teams and identify the right mentor from
  mentor connect module if he warrants deep knowledge in respective
  domain/technology.
- ATL Mentors & school management/principal to work on identifying the right HEI &
  Industry partnerships and proceed with Memorandum of Understanding (MoU)
  procedures. Use the partner onboarding process, college connect form and business
  connect form.

## **Access Website ?**

- Access [HamaraLabs](http://hamaralabs-dev.web.app)

- **Login Information**

  - Email: `atlincharge22@gmail.com`
  - Password: `atlincharge22@gmail.com`

## **Wanna run it locally?**

- Clone the repository
- Run `npm install --force`
- Create your firebase project in [firebase console](https://console.firebase.google.com/)
- Enable authentication with email and password
- Enable firestore
- Enable storage
- Enable hosting
- Run `firebase init` and select the services you enabled
- Create a `.env` file in the root directory and add the following keys
  - `REACT_APP_FIREBASE_API_KEY={FIREBASE_API_KEY}`
  - `REACT_APP_FIREBASE_AUTH_DOMAIN={FIREBASE_AUTH_DOMAIN}`
  - `REACT_APP_FIREBASE_PROJECT_ID={FIREBASE_PROJECT_ID}`
  - `REACT_APP_FIREBASE_STORAGE_BUCKET={FIREBASE_STORAGE_BUCKET}`
  - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID={FIREBASE_MESSAGING_SENDER_ID}`
  - `REACT_APP_FIREBASE_APP_ID={FIREBASE_APP_ID}`
  - `REACT_APP_FIREBASE_MEASUREMENT_ID={FIREBASE_MEASUREMENT_ID}`
- Finally run `npm start` and you are good to go!
- **Wanna login to your local HamaraLabs ?**
  - Create a user in firebase console by going to the authentication page and mention the email and password
  - Add the user to the firestore collection `atlUsers` with the following fields
    - `email`
    - `role`
    - `uid`
    - `name`
  - Finatlly login with the email and password you created!

- It's still not over !
  - Initialise cloud functions in your root directory by running `firebase init functions`
  - Clone this repository [HamaraLabs-CloudFunctions](https://github.com/vmss2009/HamaraLabs-cloud-functions.git)
  - Do the various changes (like rearranging the files, setting up the environment variables etc)
  - Upload this code to cloud functions by running `firebase deploy --only functions`
 - Update the cloud functions URLs and the env files in the following files:-
   - `public/firebase-messaging-sw.js`
   - `src/routes/Payments/Payments.jsx`
   - `src/routes/Payments/PaymentsReportBox.jsx`
   - `src/routes/TinkeringActivityGeneration/TinkeringActivity.jsx`
- Now all functions will work perfectly fine!
- **Note** - 
    - You need to have a firebase blaze account
    - You need to have Nodejs installed in your system

## **Technologies**

- ReactJS
- Bootstrap
- NodeJS
- Firebase Backend
- Firestore NoSQL database
- Firebase authentication
- Firebase hosting
- Firebase cloud functions