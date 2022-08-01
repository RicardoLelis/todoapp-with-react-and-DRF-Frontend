import axios from 'axios'
import React, {useState} from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { MdCheckBox, MdCheckBoxOutlineBlank, MdEdit, MdDelete } from 'react-icons/md'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'


export default function TodoList({ todos = [], setTodos }) {

    const [show, setShow] = useState(false)
    const [record, setRecord] = useState(null)

    const handleClose = () => {
        setShow(false)
    }
    const handleDelete = (id) => {
        axios.delete(`/api/todos/${id}/`)
            .then(() => {
                const newTodos = todos.filter(t => {
                    return t.id !== id
                })
                setTodos(newTodos)
            }).catch(() => {
                alert("Something went wrong")
            })
    }

    const handleUpdate = async (id, value) => {
        return axios.patch(`/api/todos/${id}/`, value)
                    .then((res) => {
                        const {data} = res
                        const newTodos = todos.map(t => {
                            if (t.id === id){
                                return data
                            } 
                            return t
                        })
                    setTodos(newTodos)
        }).catch(() => {
            alert("Something went wrong")
        })
    }

    const renderGroupListItem = (t) => {
        return <ListGroup.Item
                    key={t.id}
                    className='d-flex justify-content-between
                    align-items-center'>
                        <div 
                            className='d-flex justify-content-between align-items-center' >
                                <span style={{
                                    marginRight: "12px",
                                    cursor: "pointer"
                                }} onClick={() => {
                                    handleUpdate(t.id, {
                                        completed: !t.completed
                                    })
                                }}>
                                    {t.completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                                </span>
                                <span>{t.name}</span>
                        </div>
                        <div>
                            <MdEdit style={{
                                cursor: "pointer",
                                marginRight: "12px"
                            }} onClick={() => {
                                setRecord(t)
                                setShow(true)
                            }} />
                            <MdDelete style={{
                                cursor: "pointer"
                            }} onClick={() => {
                                handleDelete(t.id)
                            }} />
                           
                        </div>
                    </ListGroup.Item>
    }

    const handleChange = (e) => {
        setRecord({
            ...record,
            name: e.target.value
        })
    }

    const handleSaveChanges = async () => {
        await handleUpdate(record.id, {name: record.name})
        handleClose()
    }

    // render the incompleted todos first
    const completedTodos = todos.filter(t => t.completed === true)
    const incompleteTodos = todos.filter(t => t.completed === false)

    return (
        <div>
            <div className='mb-2 mt-4'>
                Incomplete To-Dos ({incompleteTodos.length})
            </div>

            <ListGroup>
                {incompleteTodos.map(renderGroupListItem)}            
            </ListGroup>
            <div className='mb-2 mt-4'>
                Complete To-Dos ({completedTodos.length})
            </div>
            <ListGroup>
                {completedTodos.map(renderGroupListItem)}            
            </ListGroup>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit To-Do</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormControl 
                    value={record ? record.name : ""} 
                    onChange={handleChange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='secondary'
                        onClick={handleClose}>
                            Close
                        </Button>
                    <Button
                        variant='primary'
                        onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                </Modal.Footer>
            </Modal>

            {/* <ListGroup>
                {todos.map(t => {
                    return <ListGroup.Item key={t.id}>
                    {t.name}
                    </ListGroup.Item>
                })} 
            </ListGroup>
            */}
        </div>

            
      );
}