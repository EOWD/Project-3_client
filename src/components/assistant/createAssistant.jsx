import React, { useState, useRef,useContext, } from 'react';
import {UserContext} from "../../context/UserContext";
import axios from 'axios';

const CreateAssistantForm = () => {
    const {user}=useContext(UserContext);

    console.log(user)
    const id =user.id
    console.log (id)
    const [assistantData, setAssistantData] = useState({
        name: '',
        description: '',
        instructions: '',
        model: '',
        image_url: '',
        tools: [],
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssistantData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value);
        setAssistantData((prevState) => ({
            ...prevState,
            tools: values,
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', id);
        Object.keys(assistantData).forEach((key) => {
            if (key === 'tools' && assistantData[key].length) {
                assistantData[key].forEach((value) => formData.append(key, value));
            } else {
                formData.append(key, assistantData[key]);
            }
        });

        Array.from(selectedFiles).forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post('http://localhost:5069/buddy/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Axios will automatically set the Content-Type to 'multipart/form-data' with the correct boundary
                },
            });

            console.log("Server response:", response.data);
            // Handle the response, such as showing a success message or redirecting the user
        } catch (error) {
            console.error("Form submission error:", error);
            // Handle errors, such as showing an error message to the user
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <h1>Create a new Assistant</h1>
                {/* Name input */}
                <label>Assistant Name</label>
                <input type="text" name="name" onChange={handleInputChange} value={assistantData.name} required />

                {/* Description input */}
                <label>Description</label>
                <input type="text" name="description" onChange={handleInputChange} value={assistantData.description} required />

                {/* Tools select */}
                <label>Tools</label>
                <select multiple name="tools" onChange={handleSelectChange} value={assistantData.tools}>
                    <option value="code_interpreter">Code Interpreter</option>
                    <option value="retrieval">Retrieval</option>
                    <option value="function" disabled>Web Browsing (Coming Soon)</option>
                </select>

                {/* Instructions textarea */}
                <label>Instructions</label>
                <textarea name="instructions" onChange={handleInputChange} value={assistantData.instructions}></textarea>

                {/* Model select */}
                <label>Model</label>
                <select name="model" onChange={handleInputChange} value={assistantData.model}>
                    <option value="gpt-4-1106-preview">GPT 4 Preview (1106)</option>
                    <option value="gpt-3.5-turbo-1106">GPT 3.5 Turbo (1106)</option>
                </select>

                {/* File input */}
                <label>Upload files</label>
                <input type="file" name="files" ref={fileInputRef} onChange={handleFileChange} multiple />

                {/* Image URL input */}
                <label>Selection Image URL (optional)</label>
                <input type="text" name="image_url" onChange={handleInputChange} value={assistantData.image_url} />

                {/* Submit button */}
                <button type="submit">Create New Assistant</button>
            </form>
        </div>
    );
};

export default CreateAssistantForm;
