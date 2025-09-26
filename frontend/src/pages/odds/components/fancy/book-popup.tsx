import React from 'react'
import ReactModal from 'react-modal'
import bookService from '../../../../services/book.service'
import { AxiosResponse } from 'axios'
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks'
import { FancyBook, selectBookFancy, setBookFancy } from '../../../../redux/actions/bet/betSlice'

const BookPopup = () => {
  const bookFancy: FancyBook = useAppSelector(selectBookFancy)
  console.log(bookFancy,"bookFancy")
  const dispatch = useAppDispatch()
  const [book, setBook] = React.useState<Record<string, number>>({})
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (bookFancy.matchId) {
      bookService.getFancyBook(bookFancy).then((res: AxiosResponse) => {
        setBook(res.data.data)
        setIsOpen(true)
      })
    }
  }, [bookFancy])
  const close = () => {
    dispatch(setBookFancy({} as FancyBook))
    setIsOpen(false)
  }
  console.log(book,"booookss")
  return <>

    <ReactModal
      isOpen={isOpen}
      onRequestClose={(e: any) => {
        close()
      }}
      contentLabel='Fancy Book'
      className={'modal-dialog modal-lg'}
      ariaHideApp={false}
    >
      <div className='modal-content '>
        <div className='modal-header'>
          <h5 style={{color:"white"}}>{bookFancy?.marketName}</h5>
          <span onClick={close} className='float-right'>
            X
          </span>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th><div className="rounded fs-5 pl-2 py-2 text-center text-white" style={{ flex: 1, textAlign: 'left' ,background: "rgb(15, 35, 39)" }}>Run</div>
              </th>
              <th>    <div className="rounded fs-5 pl-2 py-2 text-center text-white"  style={{ flex: 1, textAlign: 'right',background: "rgb(15, 35, 39)" }}>Profit</div>
              </th>
            </tr>
          </thead>
          {Object.keys(book).length > 0 &&
            Object.keys(book).map((itemKey) => (
              <tr key={itemKey} className={book[itemKey] < 0 ? 'lay' : 'back'}>
                <td className='text-center'>{itemKey}</td>
                <td className={`${book[itemKey] < 0 ? 'red' : 'green'} text-center`}>{book[itemKey]}</td>
              </tr>
            ))}
        </table>
      </div>
    </ReactModal>
    </>
}

export default BookPopup
