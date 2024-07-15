export default function ButtonCard({label, width, height}) {
    return (
        <button style={{width: width, height: height}} className="card" alt={label}>{label}</button>
    )
}