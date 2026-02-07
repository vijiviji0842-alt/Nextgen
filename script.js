document.addEventListener('DOMContentLoaded', () => {
    // Countdown Timer
    const eventDate = new Date('February 28, 2026 09:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = "Event Started!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Registration Form Handling
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Registration Data:', data);

        // Real backend call
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Processing...';
        submitBtn.disabled = true;

        // Convert checkbox to boolean for backend matching if needed, 
        // though our Python handles the "on" string or absence.
        // Actually the FormData check in Python: 1 if data.get('accommodation') else 0
        // When using JSON, we need to make sure the accommodation field is correct.
        // FormData entries() might give 'on' for checkbox. 
        // Let's manually robustify the data object for JSON.
        data.accommodation = form.querySelector('#accommodation').checked;

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    alert(`Thanks for registering, ${data.name}! We'll see you at the NextGen Symposium.`);
                    form.reset();
                } else {
                    alert('Registration failed: ' + (result.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    });

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Add 'visible' class styles dynamically or rely on CSS
    // Actually, let's just make the simple inline style change via JS for now
    // A more robust way is to toggle a class defined in CSS.
    // Let's add the class logic to the loop above:
    document.head.insertAdjacentHTML("beforeend", `<style>
        .visible { opacity: 1 !important; transform: translateY(0) !important; }
    </style>`);

    // Chatbot Logic
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    chatToggle.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
    });

    closeChat.addEventListener('click', () => {
        chatContainer.classList.remove('active');
    });

    const addMessage = (text, sender) => {
        const div = document.createElement('div');
        div.classList.add('message', sender);
        div.innerText = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const handleUserMessage = () => {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;

        addMessage(chatInput.value, 'user');
        chatInput.value = '';

        setTimeout(() => {
            let response = "I can help you with event details, registration, and dates.";

            if (text.includes('date') || text.includes('when')) {
                response = "The symposium is on February 28, 2026.";
            } else if (text.includes('deadline') || text.includes('last date')) {
                response = "Registration closes on March 18, 2026. Don't miss out!";
            } else if (text.includes('fee') || text.includes('cost') || text.includes('price')) {
                response = "The entry fee is ₹300 per participant. This covers all events, lunch, and a certificate.";
            } else if (text.includes('event') || text.includes('technical')) {
                response = "We have Paper Presentation, SQL Master, Python Pro-Coding, and Web-Craft.";
            } else if (text.includes('non-technical') || text.includes('fun')) {
                response = "Join the Tech-Quiz, Photography, Treasure Hunt, or Connection game!";
            } else if (text.includes('register') || text.includes('join')) {
                response = "You can register using the form on this page. Just click 'Register Now' or scroll down.";
            }

            addMessage(response, 'bot');
        }, 500);
    };

    sendBtn.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });
});
