import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
    const [user, setUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('jwtToken'); // replace 'jwtToken' with the key you used to store the token
        if (token) {
            const decodedToken = jwtDecode(token);
            setUser(decodedToken);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('jwtToken'); // replace 'jwtToken' with the key you used to store the token
        setUser({});
        window.location.href = '/'; // Redirect to login page
    };


    return (
        <>  <header className="flex items-center h-auto px-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900">
            <a className="flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-800 dark:text-white" href="/">
                Kanban Board
            </a>
            <div className="ml-auto flex flex-row items-center gap-4">
                <div className='flex flex-row justify-center items-center p-1 gap-4'>

                    <button className="rounded-full bg-gray-200 hover:bg-gray-300 p-1 dark:bg-gray-700 dark:hover:bg-gray-600">
                        <img
                            alt="Avatar"
                            className="rounded-full h-8 w-8 object-cover"
                            src={user.picture}
                        />
                    </button>
                    <div className="flex flex-col text-base font-medium">
                        <div className="text-gray-800 dark:text-white">{user.name}</div>
                        <div className="text-base font-normal text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                </div>
                <div>

                    <button onClick={logout} className=" w-fit p-2 text-white font-bold py-1 mt-1 rounded border border-gray-300 hover:bg-gray-700 ">
                        Logout
                    </button>
                </div>

            </div>

        </header>


        </>
    )
}

export default Navbar