import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast"

const Files = () => {
    const [data, Setdata] = useState()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const user = JSON.parse(localStorage.getItem("user"))

    const getData = async () => {
        await fetch(`https://codeeditor-w8wq.onrender.com/${user.username}/files`)
            .then(response => response.json())
            .then(files => {
                Setdata(files)
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        if (!user) {
            navigate("/auth/signin")
        } else {
        getData()
    }
    }, [])

    const clickFile = (file) => {
        navigate(`/${user.username}/editor/${file._id}`)
    }

    const newFile = async () => {
        const newtestfile = {
            filename: `unnamed_${data?.length + 1}.py`,
            code: `print("welcome to the my project")`,
            lang: "python"
        }
        const response = await fetch(`https://codeeditor-w8wq.onrender.com/${user.username}/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newtestfile)
        })

        const thisdata = await response.json()

        toast.promise(Promise.resolve(thisdata),
            {
                loading: 'Creating new file...',
                success: <b>File created successfully</b>,
                error: <b>Failed to create file</b>
            },
            {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    padding: '10px',
                }
            }).then(() => getData())
    }

    const delFile = async (e, file) => {
        e.stopPropagation()
        const response = await fetch(`https://codeeditor-w8wq.onrender.com/${user.username}/files/${file.filename}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(file)
        })

        const thisdata = await response.json()

        toast.promise(Promise.resolve(thisdata),
            {
                loading: 'Deleting file...',
                success: <b>File deleted successfully</b>,
                error: <b>Failed to delete file</b>
            },
            {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    padding: '10px',
                }
            }).then(() => getData())
    }

    const renameFile = async (e, file) => {
        e.stopPropagation()
        let filename = ""
        if(file.lang.toLowerCase() == "python") {
            filename = file.filename.replace(".py", "")
        } else {
            filename = file.filename.replace(".js", "")
        }
        let newname = prompt("Enter new name for file", filename)
        if (file.lang.toLowerCase() == "python") {
            newname = newname + ".py"
        } else {
            newname = newname + ".js"
        }
        if (newname) {
            const response = await fetch(`https://codeeditor-w8wq.onrender.com/${user.username}/files/${file.filename}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: newname, username: JSON.parse(localStorage.getItem("user")).username })
            })

            const thisdata = await response.json()

            toast.promise(Promise.resolve(thisdata),
                {
                    loading: 'Renaming file...',
                    success: <b>File renamed successfully</b>,
                    error: <b>Failed to rename file</b>
                },
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        padding: '10px',
                    }
                }).then(() => getData())
        }
    }

    const handleSearch = async (e) => {
        setSearchTerm(e.target.value)
        if(
            e.target.value == "" ||
            e.target.value == null ||
            e.target.value == undefined
        ) {
            getData()
            return
        }
        const filteredFiles = data.filter((file) => {
            return file.filename.toLowerCase().includes(searchTerm.toLowerCase())
        })
        Setdata(filteredFiles)
    }

    return (
        <div style={{
            justifyContent: "space-between"
        }} className='home_body'>
            <Navbar />

            <div className="files_body">
                <div className="files_body_header">
                    <h1>Files</h1>
                    {/* File Search Section */}
                    <div className="file_search">
                        <input
                            value={searchTerm}
                            onChange={handleSearch}
                            type="text" placeholder="Search Files" />
                    </div>
                    <div className="new_file_container">
                        <h2>{data?.length} files</h2>
                        <ion-icon title="Add New File" onClick={() => newFile()} name="add-outline"></ion-icon>
                    </div>
                </div>
                <div className="files_body_files">
                    {data?.map((file) => {
                        return (
                            <div className="files_body_file" onClick={() => clickFile(file)}>
                                <div className="file_setting_icons">
                                    <ion-icon title="Delete This File" onClick={(e) => delFile(e, file)} name="add-outline"></ion-icon>
                                    <ion-icon title="Rename This File" onClick={(e) => renameFile(e, file)} name="create-outline"></ion-icon>
                                </div>
                                <img src="https://cdn2.iconfinder.com/data/icons/font-awesome/1792/code-512.png" />
                                <p>{file.filename}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Files