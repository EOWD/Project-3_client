import React, { useState, useContext, useEffect } from "react";
import { UserDataContext } from "../../../context/UserDataContext";
import "./Diary.css";
import { Input, Button, Tooltip, Whisper } from 'rsuite';
import { Info } from 'lucide-react';
    

function Diary() {

    const { diaries } = useContext(UserDataContext);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [editableEntry, setEditableEntry] = useState('');
    const [editableTitle, setEditableTitle] = useState('');

    
    useEffect(() => {
        // Check if `diaries` is loaded and has at least one entry
        if (diaries && diaries.length > 0) {
            setSelectedEntry(diaries[0]);
            setEditableEntry(diaries[0].entry);
            setEditableTitle(diaries[0].entry);
        }
        document.querySelector('.diaryContainer').style.height = `${window.innerHeight}px`;
    }, [diaries]);

    useEffect(() => {
        if (selectedEntry) {
            setEditableEntry(selectedEntry.entry);
            setEditableTitle(selectedEntry.entry);
        }
    }, [selectedEntry]);

    function toggleEditEntry(input, staticEl){
        if(document.querySelector('.'+input).style.display === `none`) {
            document.querySelector('.'+input).style.display = `inline-flex`;
            document.querySelector('.'+staticEl).style.display = `none`;
        } else {
            document.querySelector('.'+input).style.display = `none`;
            document.querySelector('.'+staticEl).style.display = `block`;
        }
    }

    function handleEditChange(value) {
        // Update the local state as the user edits the input
        setEditableEntry(value);
    }
    function handleTitleChange(value) {
        setEditableTitle(value); // Update title as the user edits
    }

    return (
        <div className="diaryContainer">
            <div className="allEntriesContainer">
                {diaries.map((entry) => {
                    return (
                    <div className="singleEntry" onClick={() => {setSelectedEntry(entry)}} key={entry._id}>
                        <p className="entryDate">{entry.date.slice(0, 10)}</p>
                        <p>{entry.entry}</p>
                        <p className="entryTextTeaser">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam recusandae corporis veritatis harum dolore...</p>
                    </div>
                    )
                })}
            </div>
            <div className="currentlyOpenEntry">
                <h2 className="entryHeadline" onClick={() => {toggleEditEntry("editEntryHeadline-container", "entryHeadline")}}>{selectedEntry && selectedEntry.entry}</h2>
                <div className="editEntryHeadline-container">
                    <Input 
                      className="editEntryTitle" 
                      style={{ flex: 1, fontSize: 30 }} 
                      value={editableTitle}
                      onChange={(value) => handleTitleChange(value)}
                    />
                    <Button onClick={() => {toggleEditEntry("editEntryHeadline-container", "entryHeadline")}}>Save</Button>
                </div>
                <div className="editEntry-container">
                    <Input 
                    className="editEntry" 
                    as="textarea" 
                    rows={3} 
                    placeholder="Textarea" 
                    value={editableEntry}
                    onChange={(value) => handleEditChange(value)} />
                    <br></br>
                    <Button onClick={() => {toggleEditEntry("editEntry-container", "staticText")}}>Save</Button>
                </div>
                <p onClick={() => {toggleEditEntry("editEntry-container", "staticText")}} className="staticText">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam nemo corrupti facilis quam incidunt dolorum illum quo quae, magnam deleniti! Voluptatum dicta vel fugit saepe iusto eveniet sed nihil eum!</p>
                <br />
                <hr />
                <br />
            </div>
        </div>
    );
}

export default Diary;