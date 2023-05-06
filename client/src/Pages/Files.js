import React, { useEffect, useRef, useState } from 'react'
import Navbar from "../Components/Navbar"
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast"

const Files = () => {
    const [data, Setdata] = useState()
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedLang, setSelectedLang] = useState("python")
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [fileName, setFileName] = useState("");
    const optionsWrapperRef = useRef(null);

    const options = [
        { value: "python", label: "Python" },
        { value: "javascript", label: "Javascript" },
    ];

    const handleSelectClick = () => {
        setOptionsOpen(!optionsOpen);
    };

    const handleOptionClick = (optionValue) => {
        setSelectedLang(optionValue);
        setOptionsOpen(false);
    };

    const selectedOption = options.find(
        (option) => option.value === selectedLang
    );


    const handleFileInputChange = (event) => {
        setFileName(event.target.value);
    };

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
            const handleClickOutside = (event) => {
                if (
                    optionsWrapperRef.current &&
                    !optionsWrapperRef.current.contains(event.target)
                ) {
                    setOptionsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [])

    const clickFile = (file) => {
        navigate(`/${user.username}/editor/${file._id}`)
    }

    function getFileNameWithExtension(fileName, selectedLang) {
        if (selectedLang === "python") {
            return fileName + ".py";
        } else if (selectedLang === "javascript") {
            return fileName + ".js";
        }
        // Handle other languages if needed
        return fileName;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newtestfile = {
            filename: getFileNameWithExtension(fileName, selectedLang),
            code: `${selectedLang.toLocaleLowerCase() == "python" ? "print('Hello World')" : "console.log('Hello World')"}`,
            lang: selectedLang
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
        if (file.lang.toLowerCase() == "python") {
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
        if (
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
        <div className='files_main_body'>
            <Navbar />

            <div className="files_body">
                <div className="files_body_header">
                    <div className="file_search">
                        <input
                            value={searchTerm}
                            onChange={handleSearch}
                            type="text" placeholder="Search Files" />
                    </div>
                    <div className="new-file-submit">
                        <form onSubmit={handleSubmit}>
                            <div className="select-wrapper" ref={optionsWrapperRef}>
                                <div
                                    className="select-inner-wrapper"
                                    onClick={handleSelectClick}
                                    data-testid="select-inner-wrapper"
                                >
                                    <div className="selected-value">{selectedOption.label}</div>
                                    <ion-icon name="chevron-down-outline"
                                        className={`${optionsOpen ? "open" : ""}`}
                                    ></ion-icon>
                                </div>
                                {optionsOpen && (
                                    <div className="options-wrapper">
                                        {options.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`option ${option.value === selectedLang ? "active" : ""
                                                    }`}
                                                onClick={() => handleOptionClick(option.value)}
                                                data-testid={`option-${option.value}`}
                                            >
                                                {option.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Enter file name"
                                value={fileName}
                                onChange={handleFileInputChange}
                                className="file-name-input"
                            />
                            <button type="submit" className="add-file-button">
                                <ion-icon name="add-outline"></ion-icon>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="files_body_files">
                    {data?.map((file) => {
                        return (
                            <div className="files_body_file" onClick={() => clickFile(file)}>
                                <div className="file_setting_icons">
                                    <ion-icon title="Delete This File" onClick={(e) => delFile(e, file)} name="close-outline"></ion-icon>
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