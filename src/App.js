import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let listStorage = localStorage.getItem('list')
  if (listStorage) {
    return JSON.parse(listStorage)
  }

  return []
}

const App = () => {

  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [alert, setAlert] = useState({show: false, msg: '', type: ''})

  useEffect( () => {
    const timeout = setTimeout( () => {
      setAlert({show: false, msg: '', type: ''})
    },3000)
    return () => clearTimeout(timeout)
  }, [alert])

  const handleSubmit = (e) => {

    e.preventDefault()

    if(!name) {
      setAlert({show: true, msg:'please enter a value', type: 'danger'})
    } else if (name && isEditing) {
      let item = list.find( item => item.id === editId)
      item.title = name
      setAlert({show: true, msg: 'item edited', type: 'success'})
      setIsEditing(false)
      setEditId(null)
    } else {
      const newItem = {title: name, id: new Date().getTime().toString()}
      setList([...list, newItem])
      setAlert({show: true, msg:'item added', type: 'success'})
    }

    setName('')
  }

  const removeItem = (id) => {
    setList(list.filter( (item) => item.id !== id))
    setAlert({show: true, msg: 'item deleted', type: 'danger'})
  }

  const editItem = (id) => {
    let itemToEdit = list.find((item) => item.id === id)
    
    setName(itemToEdit.title)
    setEditId(itemToEdit.id)
    setIsEditing(true)
  }

  const emptyList = () => {
    setList([])
    setAlert({show: true, msg:'empty list', type:'danger'})
  }

  useEffect( () => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [handleSubmit])

  return (
    <section className="section-center">
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" className='grocery' placeholder='e.g. eggs' value={name} onChange={(e) => setName(e.target.value)} />
          <button className='submit-btn'>{ isEditing ? 'edit' : 'submit'}</button>
        </div>
      </form>
      {list.length > 0 &&
        <div className="grocery-container">
          <List list={list} removeItem={removeItem} editItem={editItem} />
          <button onClick={emptyList} className="clear-btn">clear items</button>
        </div>
      }
    </section>
  )
}

export default App
