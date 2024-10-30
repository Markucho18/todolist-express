
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJpYXQiOjE3MzAxOTczOTQsImV4cCI6MTczMDIwMDk5NH0.X3dABu4lQGWTl_ZALsk5EG2-Syp9juiJ9dKPGCw_jss"

handleProfilePicSubmit = async (e) => {
  const URL = "http://localhost:3000/users/picture"
  e.preventDefault()
  const form = e.target
  const formData = new FormData(form)
  console.log("formData: ", formData)
  try{
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${TOKEN}`
      },
      body: formData
    })
    if(!response.ok){
      console.log(response)
      throw new Error("Error en la actualizacion del perfil")
    }
    const data = await response.json()
    console.log("data: ", data)
  }
  catch(error){
    console.log("Ocurrio un error", error)
  }
} 

document.getElementById("profilePicForm")?.addEventListener("submit", handleProfilePicSubmit)

const handleLoginSubmit = async (e) => {
  console.log("handleLoginSubmit")
  const URL = "http://localhost:3000/users/login"
  e.preventDefault
  const form = e.target
  const formData = new FormData(form)
  try{
    const response = await fetch(URL, {
      method: "POST",
      body: formData
    })
    if(!response.ok){
      throw new Error("Hubo un error en el login")
    }
    const data = await response.json()
    console.log("data: ", data)
  }
  catch(error){
    console.log("Hubo un error padre: ", error)
  }
}

document.getElementById("loginForm").addEventListener("submit", handleLoginSubmit)