import React, { useState, useEffect, useRef } from 'react'
import Navbar from '../Components/Navbar'
import CustomSelect from '../Components/CustomSelect'
import PostModal from '../Components/PostModal'
const Forum = () => {
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [lang, setLang] = useState("python")
  const optionsWrapperRef = useRef(null);
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false);

  const options = [
    { value: "python", label: "Python" },
    { value: "javascript", label: "Javascript" },
  ];

  const selectedOption = options.find(
    (option) => option.value === lang
  );
  const getPosts = async () => {
    const response = await fetch(`https://codeeditor-w8wq.onrender.com/forums`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log(data)
    setFilteredPosts(data)
  }

  useEffect(() => {
    getPosts()
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
  }, [])

  const handleSelectClick = () => {
    setOptionsOpen(!optionsOpen);
  };

  const handleOptionClick = (optionValue) => {
    setLang(optionValue);
    setOptionsOpen(false);
    getPosts(optionValue)
  };

  return (
    <div className='forum_body'>
      {postModalOpen && <PostModal getPosts={getPosts} handleClose={() => setPostModalOpen(false)} />}
      <Navbar />
      <div className="forum_container">
        <div className="forum_header">
          <input
            type="text"
            placeholder="Search ın forums"
            className="forum_search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <CustomSelect
            options={options}
            selectedOption={selectedOption}
            handleSelectClick={handleSelectClick}
            handleOptionClick={handleOptionClick}
            optionsOpen={optionsOpen}
            setOptionsOpen={setOptionsOpen}
          />
          <button onClick={() => setPostModalOpen(!postModalOpen)} className="add-file-button ml-auto">
            <ion-icon name="add-outline"></ion-icon>
          </button>
        </div>
        <div className="forum_posts_container">
          {filteredPosts
            ?.filter((file) => file?.title?.toLowerCase().includes(searchValue.toLowerCase()))
            ?.filter((post) => post?.lang?.toLowerCase() === selectedOption?.value?.toLowerCase())
            ?.map(post => (
              <div
                onClick={() => window.location.href = `/post/${post._id}`}
              className="forum_post" key={post._id}>
                <div className="post_header">
                  <h3>{post.title}</h3>
                  <p>{post.username}</p>
                </div>
                <p className='desc'>{post.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Forum