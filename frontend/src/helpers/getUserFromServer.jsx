import apiRequest from '../utils/api';

const getUserFromServer = async() => {
    try {
        // Use hardcoded server URL for consistency
        const serverUrl = 'http://localhost:3000'
        console.log("Fetching user from:", serverUrl)
        
        return await apiRequest(`${serverUrl}/api/auth/user`);
    } catch (error) {
        console.error('Error in getUserFromServer:', error)
        return { success: false, message: 'Failed to fetch user data' }
    }
}

export default getUserFromServer