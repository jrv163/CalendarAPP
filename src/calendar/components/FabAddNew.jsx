import { addHours } from "date-fns";
import { useCalendarStore, useUiStore } from "../../hooks"


export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClickModal = () => {
        setActiveEvent({   // para limpiar la nota anterior y no lleva un ID
            title: '',
            notes: '',
            start: new Date(),
            end: addHours( new Date(), 2 ),
            bgColor: '#fafafa',
            user: {
              _id: '123',
              name: 'Jamer'
            }
        })
        openDateModal();
    }


  return (
    <button
    className="btn btn-primary fab"
    onClick={ handleClickModal }
    >
    <i className="fas fa-plus" ></i>
    </button>
  )
}
