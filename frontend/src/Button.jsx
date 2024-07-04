// шаблон кнопки, в props передаём название иконки на кнопке и её alt

export default function Button({className = '', icon, label}) {
    return (
        <button className={`icon-button ${className}`}>
              <img draggable={false} src={`icons/${icon}.svg`} alt={label} />
        </button>
    )
}