const InstagramAuthButton = () => {
    const handleAuth = () => {
        const clientId = '327278296945075';
        const redirectUri = 'http://localhost:5005/insta/callback';
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
        
        window.location.href = authUrl;
    };

    return (
        <button onClick={handleAuth}>Log in with Instagram</button>
    );
};

export default InstagramAuthButton;