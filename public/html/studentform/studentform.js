function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        session: params.get('session')
    };
}
document.addEventListener('DOMContentLoaded', () => {
    const { session } = getQueryParams();
    if (session) {
        console.log('Session ID:', session);
        
    }
});
  
document.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        const session = params.get('session');
        if (session) {
            // Append the session ID to the form's action URL
            const form = document.getElementById('attendanceForm');
            form.action += `?session=${encodeURIComponent(session)}`;
        } else {
            // Optionally handle the case where no session is provided
            alert('Session ID is missing.');
        }
    }); 
        
        
        
        
        
        
        