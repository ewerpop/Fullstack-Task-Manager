import { useState } from "react"

export default function DropArea({onDrop, index}) {
    const [display, setDisplay] = useState(false)
    const hidden = {opacity: '0'}
    
    return(
        <section className="card" style={(display ? null: hidden)} onDragLeave={() => setDisplay(false)} onDragEnter={() => setDisplay(true)} onDragOver={(e) => e.preventDefault()}  onDrop={() => {onDrop()
            setDisplay(false)
        }}>
            drop here
        </section>
    )
}
