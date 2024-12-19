import React, { useState, useEffect } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    country: '',
    state: '',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [error, setError] = useState('');


  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries')
      .then((response) => response.json())
      .then((data) => setCountries(data.data))
      .catch((err) => console.error('Error fetching countries:', err));
  }, []);

  
  useEffect(() => {
    if (formData.country) {
      fetch(`https://countriesnow.space/api/v0.1/countries/states/q?country=${formData.country}`)
        .then((response) => response.json())
        .then((data) => setStates(data.data.states || []))
        .catch((err) => console.error('Error fetching states:', err));
    }
  }, [formData.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, address, phone, country, state } = formData;
    if (!name || !address || !phone || !country || !state) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    console.log('Submitted Data:', formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <h2>Contact Form</h2>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div>
          <label>Address:</label>
          <textarea name="address" value={formData.address} onChange={handleInputChange}></textarea>
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div>
          <label>Country:</label>
          <select name="country" value={formData.country} onChange={handleInputChange}>
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.country} value={country.country}>
                {country.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>State:</label>
          <select name="state" value={formData.state} onChange={handleInputChange}>
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.state_code} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Submit</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <h3>Submitted Data:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ContactForm;
