import { useRouteError } from "react-router-dom";
import Navbar from "./Navbar";
import './Home.css';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="App App-header" id="error-page">
      <Navbar />
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default ErrorPage;