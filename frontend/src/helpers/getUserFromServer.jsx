const getUserFromServer = async() =>{
    try {
        const serverUrl = import.meta.env?.VITE_SERVER_URL || 'http://localhost:3000'
        const res = await fetch(`${serverUrl}/api/auth/user`,{
            credentials:'include'
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.error('Error in getUserFromServer:', error)
        return { success: false, message: 'Failed to fetch user data' }
    }
}

export default getUserFromServer