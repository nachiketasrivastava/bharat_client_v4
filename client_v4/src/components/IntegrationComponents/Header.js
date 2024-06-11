import icStar from '../../assets/images/icons-stars.png';

export const Header = () => {
    return (
      <div className="top">
        <div className="top-center">
          <h3>
            Connect <span>GTM Copilot</span> with your tools
          </h3>
          <p>
            Quit switching tools and work from one place. Integrate any tool in
            60 seconds <br /> and supercharge your workflows in 1 click.
          </p>
          <button className='top-integration-btn'>
            <img src={icStar} alt="Icon" className="star-icon" />
            Request Integration
          </button>
        </div>
      </div>
    );
  };
  