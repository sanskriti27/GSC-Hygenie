# GDSC Solution Challenge 2023 - Hygenie
**❓ Problem Statement**
---

According to a survey by the World Toilet Organization, 61% of people in 13 Asian countries avoid using public washrooms due to cleanliness concerns. In a survey by Initial Hygiene, 44% of people in Australia said they would not visit a business again if they encountered unclean washrooms. 

The lack of access to public restrooms is a common problem faced by many people, especially travelers, and tourists. Finding a clean and safe public restroom can be a challenging and time-consuming task, which can be further complicated by unfamiliarity with the location. 

🌍 **Target SDG: Clean Water and Sanitation**
---

SDG 6 - Clean Water and Sanitation - emphasizes the importance of access to basic sanitation facilities as a key component of ensuring universal access to clean water and sanitation. Public toilet facilities play a critical role in providing access to safe and hygienic sanitation for the general public. Access to clean and well-maintained public toilet facilities can help prevent the spread of diseases, promote public health, and improve the overall quality of life. 

![Untitled](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/Untitled.png)

📊 **Market Survey**

---

******Findings******

1. It is a common issue that individuals struggle to find clean and safe public washrooms in their vicinity.
2. Those with health issues are often unable to locate washrooms with the required assistance and support.
3. Locating washrooms with necessary amenities proves to be challenging for many people.
4. The survey campaign revealed that several washrooms remain unexplored, lacking proper facilities.
5. SitOrSquat and Flush are some existing applications in the market.

![RCND (1).png](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/RCND_(1).png)

![Copy of Hygenie App - Certificate of Volunteering.png](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/Copy_of_Hygenie_App_-_Certificate_of_Volunteering.png)

**********Analysis********** 

1. Our app stands out from existing ones by providing real-time analysis of washroom cleanliness and safety scores, utilizing advanced AI technology for efficient data processing and user-friendly navigation.
2. Our app benefits people by ensuring that they can easily locate clean and safe washrooms, receive necessary assistance during emergencies, and report any issues for a quick resolution.

🎯 **Target Audience**
---

![           Commuters](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/undraw_shopping_bags_8l6g.svg)

           Commuters

![People with Infants and Kids](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/undraw_family_vg76.svg)

People with Infants and Kids

![ People with Disability](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/undraw_personal_notes_-8-n63.svg)

 People with Disability

![            Tourists](GDSC%20Solution%20Challenge%202023%20-%20Hygenie%20a518c46575ee44ff9ca31eb885379b86/undraw_travelers_re_y25a.svg)

            Tourists

**Assumptions**
---

🖥️ ******************Technical******************

1. The data about locations and amenities is accurate and up-to-date.
2. Implement stable existing algorithms.
3. Locates facilities in the least time.

⚙️ ********************Operational********************

1. The users will provide relevant feedback on toilet facilities.
2. Easy-to-Use portal to locate the facility.

🛠️ **Our Solution**
---

 1️⃣ **Search Public Facility by Name** 

**Advantages**

1. **Convenience**: Users can easily revisit by searching for the name instead of remembering its location or details.
2. ****Saves time:**** Users can easily search for a public toilet by name instead of scrolling through a list of locations.

****************************Implementation****************************

1. **Database Population:** The database was gathered during a campaign where team members and volunteers populated it with information on washrooms in the Delhi region.
2. **Filtering:** After the user entered a name, the program queried Firebase to find titles matching the input. All matching titles were then displayed, along with their corresponding information.

**Demonstration**

[https://youtu.be/1gHJgY7AXAs](https://youtu.be/1gHJgY7AXAs)

2️⃣ **Search by Location**

********************Advantages********************

1. **Finds the nearest toilet:** Users can quickly locate the nearest public toilet facility based on their current location, reducing the time and effort required to find a suitable toilet.
2. **Accessibility:** This feature is especially useful for individuals with mobility issues or are in unfamiliar areas, providing easy access to nearby public toilet facilities.

****************************Implementation****************************

1. **Geolocation:** The current location was retrieved using geolocation web API, and the washrooms located within a 2km radius of the current location were fetched.

**Demonstration**

[https://youtu.be/1gHJgY7AXAs](https://youtu.be/1gHJgY7AXAs)

3️⃣ **Amenities of the Toilet**

********************Advantages********************

1. **Helps users make informed decisions:** Users can easily see the amenities offered at a public toilet facility, allowing them to make informed decisions about which facility to use based on their needs.
2. **Reduces confusion:** Displaying amenities prevents confusion and ambiguity in public toilets, ensuring users don't enter the wrong facilities or waste time searching for unavailable amenities.

****************************Implementation****************************

1. **Survey and Availability:** During the survey, different amenities were recorded, and the website displays corresponding icons indicating their availability, such as accessibility, paper towels, sanitary napkin disposal, eco-friendly toilets, etc.
2. **Amenities on Display:** On the web application, only the icons indicating the available amenities are displayed.

**Demonstration**

[https://youtu.be/1gHJgY7AXAs](https://youtu.be/1gHJgY7AXAs)

**4️⃣ Ratings about Safety and Cleanliness**

********************Advantages********************

1. **Encourages better hygiene practices:** A platform for rating public toilet facilities can encourage better hygiene practices among facility managers, resulting in cleaner and safer facilities.
2. **Enhances user experience:** Rating and giving feedback on public toilet facilities' safety and cleanliness can improve the app's user experience by providing valuable information and empowering users to make informed decisions.

****************************Implementation****************************

1. **Use of Open AI for review analysis:** OpenAI processed the reviews and generated a cleanliness and safety score for each washroom, rating them on a scale of 1 to 5.
2. **Scaling and Review:** The washrooms were evaluated based on the cleanliness and safety scores generated by OpenAI. If a washroom had a safety score of more than 4, it was considered safe, and if it had a cleanliness score of more than 3.5, it was considered clean.

**Demonstration**

[https://youtu.be/1gHJgY7AXAs](https://youtu.be/1gHJgY7AXAs)

5️⃣ **Show Location on Map**

******Advantages******

1. **Provides visual aid:** Users can easily visualize the location of the public toilet facilities on a map, making it easier for them to navigate to the facility.
2. **Helps plan routes:** Users can plan their routes to include public toilets, ensuring access to clean and safe facilities.

****************************Implementation****************************

1. **Map Plot:** A map was used to display the survey coordinates, which were extracted from the backend and rendered on the map.
2. **Navigation:** When clicked, the external link navigates to the location on Google Maps using either the title or the location coordinates of the washroom, providing directions.

****************Demonstration****************

[https://youtu.be/1gHJgY7AXAs](https://youtu.be/1gHJgY7AXAs)

6️⃣ **Reporting issues and Emergency Assistance**

********************Advantages********************

1. **Regular Updates:** The web application allows users to report any issues with the washroom. These reports are incorporated into the analysis, and the scores are adjusted accordingly.
2. **Emergency Assistance:** For individuals with health issues related to gut and urine, the web application provides an emergency assistance button that directs them to the nearest washroom and enables them to request assistance.

**************************Implementation**************************

1. **Reporting Issues:** A form was added to the web application for users to report issues such as leaks and dirty areas. The responses from the form are processed using OpenAI to identify the type and severity of the issue.
2. **Emergency Button:** When pressed, the emergency assistance button initiates a call to the ambulance service from the user's current location.

****************Demonstration****************

[https://youtu.be/1gHJgY7AXAs](https://youtu.be/1gHJgY7AXAs)
