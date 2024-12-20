import React from 'react'

const ToogleComponent = () => {
  return (
    <>
        <div
           className="more-item"
           aria-expanded={openMore}
           onClick={toggleMore}
           aria-controls={`more-content-1`}
                   >
                      <span className="icon">
                        {openMore ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faPlus} />}
                      </span>
                    </div>
                    {openMore && (
        <div id={`more-content-1`} className="more-content">
          {/* Placeholder for additional content */}
          <span>Additional Information</span>
        </div>
      )}
    </>
  )
}

export default ToogleComponent