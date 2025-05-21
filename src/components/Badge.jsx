import PropTypes from 'prop-types';

const Badge = ({ text, bgColor, textColor, darkBgColor, darkTextColor }) => {
    return (
        <span className={`bg-${bgColor} text-${textColor} text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${darkBgColor} dark:text-${darkTextColor}`}>
            {text}
        </span>
    );
};

Badge.propTypes = {
    text: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    darkBgColor: PropTypes.string.isRequired,
    darkTextColor: PropTypes.string.isRequired,
};

export default Badge;