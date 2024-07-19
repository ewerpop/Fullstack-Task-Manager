export default function ButtonCard({label, width, height, onClick}) {
    return (
        <button style={{width: width, height: height}} className="card" alt={label} onClick={() => onClick}>{label}</button>
    )
}