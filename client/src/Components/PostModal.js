import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import CustomSelect from './CustomSelect';

const PostModal = ({ handleClose, getPosts }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [lang, setLang] = useState('python');
    const optionsWrapperRef = useRef(null);
    const optionsFilesWrapperRef = useRef(null);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [optionsFilesOpen, setOptionsFilesOpen] = useState(false);
    const [filename, setFilename] = useState('');
    const [files, setFiles] = useState([]);

    const options = [
        { value: 'python', label: 'Python' },
        { value: 'javascript', label: 'Javascript' },
    ];

    const selectedOption = options.find((option) => option.value === lang);

    const selectedFile = files.find((file) => file.filename === filename);

    const getUserFiles = async () => {
        const user = JSON.parse(localStorage.getItem('user'))
        await fetch(`https://codeeditor-w8wq.onrender.com/files/${user.username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const files = data?.filter((file) => file.Ispublic === true)
                setFiles(files)
            })
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        getUserFiles();
        const handleClickOutside = (event) => {
            if (optionsWrapperRef.current && !optionsWrapperRef.current.contains(event.target)) {
                setOptionsOpen(false);
            }
            if (optionsFilesWrapperRef.current && !optionsFilesWrapperRef.current.contains(event.target)) {
                setOptionsFilesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'))
        if(selectedFile && selectedOption) {
            fetch(`https://codeeditor-w8wq.onrender.com/${user.username}/forums/${selectedFile._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description: content, lang: lang })
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    toast.success("successfully created post in forum", {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    getPosts()
                    handleClose();
                } else {
                    toast.error(data.message);
                }
            })
            .catch((error) => console.error(error));
        } else {
            toast.error("Please select a file and language", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    const handleSelectClick = () => {
        setOptionsOpen(!optionsOpen);
    };

    const handleOptionClick = (optionValue) => {
        setOptionsOpen(false);
        setLang(optionValue);
    };

    const handleSelectFilesClick = () => {
        setOptionsFilesOpen(!optionsFilesOpen);
    };

    const handleOptionFilesClick = (filename) => {
        setFilename(filename);
        setOptionsFilesOpen(false);
    };


    return (
        <div className='post_modal'>
            <div className='post_modal_content'>
                <div className='post_modal_header'>
                    <h3 className='post_modal_title'>New Post</h3>
                    <button className='post_modal_close' onClick={handleClose}>
                        <ion-icon name='close-outline'></ion-icon>
                    </button>
                </div>
                <form className='post_modal_form' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder='Title'
                        className='post_modal_input'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <CustomSelect
                        options={options}
                        selectedOption={selectedOption}
                        handleSelectClick={handleSelectClick}
                        setOptionsOpen={setOptionsOpen}
                        handleOptionClick={handleOptionClick}
                        optionsOpen={optionsOpen}
                        lang={lang}
                    />
                    <div className='select-wrapper' style={{
                        marginTop: "10px"
                    }} ref={optionsFilesWrapperRef}>
                        <div
                            className='select-inner-wrapper'
                            onClick={handleSelectFilesClick}
                            data-testid='select-files-inner-wrapper'
                        >
                            <div className='selected-value'>{selectedFile ? selectedFile.filename : 'Choose file'}</div>
                            <ion-icon name='chevron-down-outline'></ion-icon>
                        </div>
                        {optionsFilesOpen && (
                            <div className='options-wrapper'>
                                {files
                                .filter((file) => file.lang.toLowerCase() == lang.toLowerCase())
                                .map((file) => (
                                    <div
                                        key={file.filename}
                                        className={`option ${file.filename === selectedFile ? 'active' : ''}`}
                                        onClick={() => handleOptionFilesClick(file.filename)}
                                    >
                                        {file.filename}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <textarea
                        placeholder='Content'
                        className='post_modal_input post_modal_textarea'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    <div className='post_modal_buttons'>
                        <button type='submit' className='post_modal_button'>
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostModal;