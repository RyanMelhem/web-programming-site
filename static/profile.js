const form = document.getElementById('profile-form');
const reviewPanel = document.getElementById('review-panel');
const reviewContent = document.getElementById('review-content');
const editBtn = document.getElementById('edit-btn');
const confirmBtn = document.getElementById('confirm-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    showReview();
});
editBtn.addEventListener('click', function() {
    reviewPanel.classList.remove("open");
    form.scrollIntoView({ behavior: 'smooth' });
});
confirmBtn.addEventListener('click', function() {
    form.submit();
});


function showReview() {
    const student_id = document.getElementById('student_id').value;
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthdate = document.getElementById('birthdate').value;
    const portfolio = document.getElementById('portfolio').value;
    const gin446 = document.getElementById('gin446').value;
    const major = document.getElementById('major').value;
    const gpa = document.getElementById('gpa').value;
    const credits = document.getElementById('credits').value;
    const graduation_month = document.getElementById('graduation_month').value;
    const language = document.getElementById('language').value;
    const project_title = document.getElementById('project_title').value;
    const project_area = document.getElementById('project_area').value;
    const description = document.getElementById('description').value;
    const team_size = document.getElementById('team_size').value;
    const project_color = document.getElementById('project_color').value;
    const meeting_date = document.getElementById('meeting_date').value;
    const meeting_time = document.getElementById('meeting_time').value;

    const graduation = document.querySelector('input[name="graduation"]:checked')?.value;
    const internship_completed = document.querySelector('input[name="internship_completed"]:checked')?.value;

    const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb => cb.value);

    const software = [...document.getElementById("software").selectedOptions].map(opt => opt.value);
    const confirmation = document.getElementById("confirmation").checked;
    
    reviewContent.textContent = "";
    addRow("Student ID", student_id);
    addRow("Full Name", fullname);
    addRow("Email", email);
    addRow("Phone", phone);
    addRow("Birthdate", birthdate);
    addRow("Portfolio", portfolio);
    addRow("GIN446", gin446);
    addRow("Major", major);
    addRow("GPA", gpa);
    addRow("Credits", credits);
    addRow("Graduation Month", graduation_month);
    addRow("Graduation Status", graduation);
    addRow("Programming Languages", language);
    addRow("Internship Completed", internship_completed);
    addRow("Technical Skills", skills.join(", "));
    addRow("Software Proficiency", software.join(", "));
    addRow("Final Year Project Title", project_title);
    addRow("Final Year Project Area", project_area);
    addRow("Final Year Project Description", description);
    addRow("Final Year Project Team Size", team_size);
    addRow("Final Year Project Color Preference", project_color);
    addRow("Meeting Date", meeting_date);
    addRow("Meeting Time", meeting_time);
    addRow("Confirmation", confirmation ? "Yes" : "No");
    
    reviewPanel.classList.add("open");
}

function addRow(label, value) {
    const row = document.createElement("p");
    row.textContent = label + ": " + value;
    reviewContent.appendChild(row);
}
