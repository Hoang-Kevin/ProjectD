import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { uuid } from 'uuidv4';
import { makeStyles } from '@material-ui/core/styles'
import { Modal, Button, TextField, FormControl, Input, InputLabel, FormHelperText } from '@material-ui/core'

import api from '../api'
import { wait } from '@testing-library/react';


function Kanban() {

    const [columns, setColumns] = useState()
    const [itemFromToDo, setitemFromToDo] = useState([]);
    const [itemFromInProgress, setitemFromInProgress] = useState([]);
    const [itemFromTested, setitemFromTested] = useState([]);
    const [itemFromDone, setitemFromDone] = useState([]);
    const [info,setInfo] = useState({
        title:""
    })
    const [isLoading, setisLoading] = useState(true);




    useEffect(() => {
        const runEffect = async () => {
            const data0 = await api.getTaskByProcess(0)
            const data1 = await api.getTaskByProcess(1)
            const data2 = await api.getTaskByProcess(2)
            const data3 = await api.getTaskByProcess(3)

            setitemFromToDo(data0.data.data)
            setitemFromInProgress(data1.data.data)
            setitemFromTested(data2.data.data)
            setitemFromDone(data3.data.data)

            setColumns(
                {
                    [0]: {
                        name: 'TO DO',
                        items: data0.data.data,
                        color: '#1b2134',
                    },
                    [1]: {
                        name: 'IN PROGRESS',
                        items: data1.data.data,
                        color: '#242e4c',
            
                    },
                    [2]: {
                        name: 'TESTED',
                        items: data2.data.data,
                        color: '#2c3c66',
                    },
                    [3]: {
                        name: 'DONE ',
                        items: data3.data.data,
                        color: '#334b81',
                    },
                }
            )
            setisLoading(false)
        }
        runEffect()
    }, []);



    // columns = the columns in question while setColumns is setting/reordering the column
    const onDragEnd = (result, columns, setColumns) => {
        // nothing will happen if we drop it outside
        if (!result.destination) return;
        // 1 column => Source = destination , so if we drag in ,(to reorder or example)
        const { source, destination } = result
        // if the source is different to the destination ( aka dragging it to another column)
        if (source.droppableId !== destination.droppableId) {
            // we select the 2 different columns
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            // we select the items in the columns
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items]
            // we select the removed items
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed)

            if(destination.droppableId == 0)
            {
                removed.starttime = ""
                removed.endtime = ""
            }
            if(destination.droppableId == 1) 
            {
                removed.starttime = new Date()
            }
            if(destination.droppableId == 3)
            {
                removed.endtime = new Date()
            }

            //Update Database
            const payload = {
                "title": removed.title,
                "starttime": removed.starttime,
                "endtime": removed.endtime,
                "currentProcess": destination.droppableId,
                "ressources": removed.ressources
            }
            api.updateTaskById([removed._id], payload)


            console.log(columns)
            setColumns({
                // keep all the same columns
                ...columns,
                [source.droppableId]: {
                    // return the used column
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            })
        } else {
            // Id of the columns where the item is , we get it by id
            const column = columns[source.droppableId];
            // we're going to manipulate the array or items by putting in a new variable
            const copiedItems = [...column.items]
            // we take the item we drag
            const [removed] = copiedItems.splice(source.index, 1)
            // we don't remove anything , we add the removed item since we just put it back, we splice it in
            copiedItems.splice(destination.index, 0, removed)
            setColumns({
                // keep all our original columns
                ...columns,
                [source.droppableId]: {
                    // return new current column(name and stuff) , items changed to the sourced items
                    ...column,
                    items: copiedItems
                }
            })
        }
    }

    const useStyles = makeStyles((theme) => ({
        main: {
            display: "flex",
            justifyContent: "center",
        }
    }))
    
    const classes = useStyles();

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setInfo({
            ...info,
            [name]:value
        })
        console.log(info)
    }

    const handleAdd = (event) => {

        event.preventDefault();
        const payload = {
            "title": info.title,
            "currentProcess": "0",
            "ressources": ["cesi.fr"]
        }

        api.insertTask(payload)

        const newItem = {
            "_id": uuid(),
            "title": info.title,
            "currentProcess": "0",
            "ressources": ["cesi.fr"]
        }
        const column0items = [...columns[0].items]
        column0items.splice(0, 0, newItem)

        setColumns({
            ...columns,
            [0]: {
                ...columns[0],
                items: column0items
            }
        })
    }


    const handledelete = (event, task, column, setColumns) => {
        api.deleteTaskById(task._id)
        window.location.reload(false);
    }

    if(isLoading == true) {
        console.log("isLoading :" + isLoading)
        return <h1>loading</h1>
    }
    else{
        console.log(columns)
        return (
            <div className={classes.main}>
                <div>
                    <form onSubmit={(event) => handleAdd(event)}> 
                        <TextField onChange={(event) => handleChange(event)} id="title" label="Title" name="title" variant="outlined" required  />
                        <Button variant="contained" color="primary" type="submit">
                            ADD
                        </Button>
                    </form>
                </div>
                <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                    {/* we need to create the columns first, and function entries gives us arrays, that's why those parameters are in array */}
                    {Object.entries(columns).map(([id, column]) => {
                        return (
                            // droppable = columns , and inside the columns is a function (starts at provided), droppable id has to be string too, we added a div below since we want the columns to have their own div
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <h2> {column.name}</h2>
                                <div style={{ margin: 8 }}>
                                    <Droppable droppableId={id} key={id}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: snapshot.isDraggingOver ? 'lightblue' : `${column.color}`, padding: 4, width: 250, minHeight: 750 }}>
                                                    {/* now we work with the items inside the column (paremters in columns.map)*/}
                                                    {column.items.map((item, index) => {
                                                        return (
                                                            // draggableid has to be a string , same for droppableID, index => tell us what index we're dragging from and dragging to
                                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        // draggableprops => Being draggable => items
                                                                        <div
                                                                            ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{
                                                                                userSelect: 'none',
                                                                                padding: 16,
                                                                                margin: '0 0 8px 0',
                                                                                minHeight: '50px',
                                                                                backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                                                                color: "white",
                                                                                ...provided.draggableProps.style
                                                                            }}>
                                                                            {item.title}
                                                                        </div>
                                                                    )
                                                                }}
                                                            </Draggable>
                                                        )
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )
                                        }}
                                    </Droppable>
                                </div>
                            </div>
                        )
                    })}
                </DragDropContext>
            </div>
        )
    }
    }

        

export default Kanban;
