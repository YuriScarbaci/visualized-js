export const Intro = () => {
  return (
    <div>
      <h2>React/javascript referencial stability</h2>
      <h3>What and why?</h3>
      <p>In Javascript variable can be divided into two macro categories:</p>
      <ul>
        <li>
          <b>Primitive</b> Variables
        </li>
        <li>
          <b>Referencial</b> Variables
        </li>
      </ul>
      <h4>
        <b>Primitive</b> Variables
      </h4>
      <p>
        We referer to <b>Primitive</b> Variables when they store data that is
        not an object and has no methods
      </p>
      <p>Those includes:</p>
      <ul>
        <li> strings </li>
        <li> numbers </li>
        <li> bigints </li>
        <li> booleans </li>
        <li> undefined </li>
        <li> symbol </li>
        <li> null </li>
      </ul>
      <p>
        Primitive variables are <b>Immutable</b>, they <b>can not be altered</b>
      </p>
      <h4>
        <b>Referencial</b> Variables
      </h4>
      <p>
        We referer to <b>Referencial</b> Variables when they store data that is
        an object
      </p>
      <p>
        Referencial variables are <b>mutable</b>, they <b>can be altered</b>
      </p>
    </div>
  );
};
