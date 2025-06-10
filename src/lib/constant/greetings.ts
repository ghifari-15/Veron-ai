export const getGreeting = () => {
    const time = new Date().getHours();
    if (time < 12) {
        return "Good morning";
    } else if (time < 18) {
        return "Good afternoon";
    } else {
        return "Good evening";
    }
}