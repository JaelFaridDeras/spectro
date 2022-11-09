import Swal from 'sweetalert2'


export const borrar=()=>{

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })
  
}


export const ErrorAlert=()=>{
  
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'error en el servidor!'
  })
}

export const Success=()=>{
return Swal.fire({
    position: 'center',
    icon: 'success',
    title: '¡Acción exitosa!',
    showConfirmButton: false,
    timer: 1500
  })
}

export const Loading=(mostrar=true)=>{
  if (mostrar)
    Swal.fire({
      title: 'Procesando!',
      html: 'Por favor espera',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
    });
  else
    Swal.closeModal();
}

export const AlertVacio=()=>{
  Swal.fire({
    title: 'No hay datos para mostrar',
    icon: 'warning',
    cancelButtonText: 'Ok',
  })
}