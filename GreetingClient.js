const fetch = require('node-fetch');
const readline = require('readline');

const url = "http://localhost:3000/api/greetings/greet"; 

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
};

async function getGreeting() {
    while (true) {
        try {
            const timeOfDay = (await askQuestion("Enter a time of day (e.g., Morning, Evening or Afternoon) or type 'exit' to quit: ")).trim();
            if (timeOfDay.toLowerCase() === 'exit') break;

            const language = (await askQuestion("Enter a language (e.g., English, Spanish or French) or type 'exit' to quit: ")).trim();
            if (language.toLowerCase() === 'exit') break;

            const tone = (await askQuestion("Enter Tone (Formal/Casual) or type 'exit' to quit: ")).trim();
            if (tone.toLowerCase() === 'exit') break;

            const greetingRequest = {
                timeOfDay,
                language,
                tone
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(greetingRequest)
            });

            if (!response.ok) {
                const error = await response.json();
                console.log(`Error: ${error.error}`);
                continue;
            }

            const greetingResponse = await response.json();
            console.log('Greeting:', greetingResponse.greetingMessage);
            console.log('Tone:', greetingResponse.tone);
        } catch (err) {
            console.log('Error fetching the greeting:', err.message);
        }
    }
    rl.close();
}

getGreeting();
