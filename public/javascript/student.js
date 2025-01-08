
  async function fetchStudents() {
    try {
      const response = await fetch('/student');
      const students = await response.json();
      const tableBody = document.querySelector('#student-table tbody');
      students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${student.Name}</td>
          <td>${student.Index}</td>
          <td>${student.Reg}</td>
          <td>${student.batch}</td>
          <td>
          <button id="attend-${student.Index}" onclick="markAttendance('${student.Index}')">
              ${student.attended ? 'Attended' : 'Attend'}
            </button>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
    }}
    async function markAttendance(Index) {
    try {
      const response = await fetch(`/attend/${Index}`, { method: 'POST' });
      const result = await response.json();
      alert(result.message);
      
      if (result.message === 'Attendance marked successfully') {
        document.getElementById(`attend-${Index}`).disabled = true;
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  }
  
async function markAttendance(Index) {
  try {
    const response = await fetch(`/attend/${Index}`, { method: 'POST' });
    const result = await response.json();
    alert(result.message);
    if (response.status === 200) {
      // Update the button text to "Attended" and disable it
      document.getElementById(`attend-${Index}`).innerText = 'Attended';
      document.getElementById(`attend-${Index}`).disabled = true;
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
  }
}
  
  window.onload = fetchStudents;
  fetchStudents();
  document.getElementById('resetButton').addEventListener('click', () => {
          fetch('/reset-attendance', { method: 'POST' })
              .then(response => response.text())
              .then(message => {
                  alert(message);
                  location.reload();
              })
              .catch(error => {
                  console.error('Error resetting attendance:', error);
              });
      });
 
      fetch('/attendance-report')
          .then(response => response.json())
          .then(data => {
              const tableBody = document.querySelector('#studentsTable tbody');
              tableBody.innerHTML = ''; 
              data.forEach(student => {
                  const row = document.createElement('tr');
                  row.innerHTML = `
                      <td>${student.Name}</td>
                      <td>${student.Index}</td>
                      <td>${student.Reg}</td>
                      <td>${student.batch}</td>
                       <td>${formattedDate}</td>
                      <td>${new Date(student.Date).toLocaleDateString()}</td>
                  `;
                  tableBody.appendChild(row);
              });
          })
          .catch(error => {
              console.error('Error fetching student details:', error);
          });
      
      
      
      
      
      

 
 
 
