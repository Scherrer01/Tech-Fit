import '../style/Card.css'

function Card (){
    return(
        
        <section className="top-stats">

        <div className="card" id="alunos">
          <div className="card-header">
            <p className="title-text">Alunos inscritos:</p>
            <p className="percent-alunos">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792">
                <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 
                19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
              </svg>
              20%
            </p>
          </div>
          <div className="data">
            <p>1070</p>
            </div>
            <div className="range">
              <div className="fill"></div>
          </div>
        </div>

        <div className="card" id="funcionarios">
          <div className="card-header">
            <p className="title-text">Colaboradores:</p>
            <p className="percent-funcionarios">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792">
                <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 
                19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
              </svg>
              4%
            </p>
          </div>
          <div className="data">
            <p>987</p>
            </div>
            <div className="range">
              <div className="fill"></div>
          </div>
        </div>

        <div className="card" id="alunos">
          <div className="card-header">
            <p className="title-text">Cancelamentos:</p>
            <p className="percent-cancelamentos">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792">
                <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 
                19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
              </svg>
              -7%
            </p>
          </div>
          <div className="data">
            <p>85</p>
            </div>
            <div className="range">
              <div className="fill"></div>
          </div>
        </div>

        <div className="card" id="alunos">
          <div className="card-header">
            <p className="title-text">Modalidades:</p>
            <p className="percent-modalidades">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 1792 1792">
                <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 
                19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
              </svg>
              10%
            </p>
          </div>
          <div className="data">
            <p>18</p>
            </div>
            <div className="range">
              <div className="fill"></div>
          </div>
        </div>
      </section>

    )
}

export default Card