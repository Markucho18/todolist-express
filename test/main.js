const URL = "http://localhost:3000/users/profile"

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJpYXQiOjE3MzAxMTk2OTAsImV4cCI6MTczMDEyMzI5MH0.qABU829oE8WR8twFHoimP_ttKjC_8y91Nyi0tujyXAc"

handleSubmit = async (e) => {
  e.preventDefault()
  const form = e.target
  const formData = new FormData(form)
  try{
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "multipart/form-data"
      },
      body: formData
    })
    if(!response.ok){
      throw new Error("Error en la actualizacion del perfil")
    }
    const data = await response.json()
    console.log(data)
  }
  catch(error){
    console.log("Ocurrio un error", error)
  }
} 

document.getElementById("form").addEventListener("submit", handleSubmit)