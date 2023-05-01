import React, { useEffect, useState } from 'react'
import Navbar from "../Components/Navbar"
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast"

const Files = () => {
    const [data, Setdata] = useState()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"))

    const getData = async() => {
        await fetch(`http://localhost:3333/${user.username}/files`)
        .then(response => response.json())
        .then(files => {
            Setdata(files)
        })
        .catch(error => console.error(error));
    }

    useEffect(() => {
       getData()
    }, [])

    const clickFile = (file) => {
        navigate(`/${user.username}/editor/${file.filename}`, { state: { file: file, isFile: true } })
    }

    const newFile = async () => {
        const newtestfile = {
            filename: `unnamed_${data?.length + 1}.py`,
            code: "print('hello world!')",
            lang: "python"
        }
        const response = await fetch(`http://localhost:3333/${user.username}/files`, {
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

    return (
        <div className='home_body'>
            <Navbar />

            <div className="files_body">
                <div className="files_body_header">
                    <h1>Files</h1>
                    <div className="new_file_container">
                        <h2>{data?.length} files</h2>
                        <ion-icon onClick={() => newFile()} name="add-outline"></ion-icon>
                    </div>
                </div>
                <div className="files_body_files">
                    {data?.map((file) => {
                        return (
                            <div className="files_body_file" onClick={() => clickFile(file)}>
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