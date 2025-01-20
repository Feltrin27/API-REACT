import { useState , useEffect, useRef} from 'react'
import './style.css'
import Trash from '../../assets/trash.svg'
import api from '../../services/api'
import iconBtn from '../../assets/icons8-edit.svg'


function Home() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null);

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers(){
    const usersFromApi = await api.get('/usuarios')
    setUsers(usersFromApi.data)
  }

  async function createUsers(){
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    }).then(() => {
      getUsers();
      inputName.current.value='';
      inputAge.current.value='';
      inputEmail.current.value='';
    });
  }

  async function deleteUsers(id){
    if(window.confirm('Tem certeza que deseja excluir este usuário?')){
      api.delete(`/usuarios/${id}`).then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
    }
  }

  async function editUsers(id){
    const userToEdit = users.find(user => user.id === id);
    if(userToEdit){
      inputName.current.value = userToEdit.name;
      inputAge.current.value = userToEdit.age;
      inputEmail.current.value = userToEdit.email;
      setEditingUser(id);
    }
  }

  async function updateUser() {
    if (editingUser) {
      await api.put(`/usuarios/${editingUser}`, {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      });
      setEditingUser(null);
      getUsers();
      inputName.current.value = '';
      inputAge.current.value = '';
      inputEmail.current.value = '';
    }
  }
  
  
  useEffect(() => {
    getUsers()
  },[])
 
  return (
      <div className="container">
        <form>
          <h1>Cadastro de Usuários</h1>
          <input placeholder='Nome'  name='nome' type='text' ref={inputName}/>
          <input placeholder='Idade' name='idade' type='number' ref={inputAge}/>
          <input placeholder='E-mail' name='email' type='email' ref={inputEmail}/>
          <button type="button" onClick={editingUser ? updateUser : createUsers}>{editingUser ? 'Atualizar' : 'Cadastrar'}</button>
        </form>

      {users.map((user) => (
      <div key={user.id} className='card'>
        <div>
          <p>Nome:  <span>{user.name}</span></p> 
          <p>Idade: <span>{user.age}</span></p> 
          <p>Email: <span>{user.email}</span></p> 
        </div>
        <div className='icones'>
          <button onClick={() => deleteUsers(user.id)}>
          <img src={Trash}/>
          </button>
          <button onClick={() => editUsers(user.id)}>
          <img src={iconBtn}/>
        </button>
        </div>
      </div>
      ))}
        
      </div>
  )
}

export default Home
