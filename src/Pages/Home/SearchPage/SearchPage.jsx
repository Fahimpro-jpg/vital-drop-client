import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const SearchPage = () => {
  const { register, handleSubmit } = useForm();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // load districts
  useEffect(() => {
    fetch('/districts.json')
      .then(res => res.json())
      .then(data => setDistricts(data));
  }, []);

  // handle search
  const onSubmit = async (data) => {
    setSearched(true);
    try {
      const res = await axios.get('http://localhost:3000/donors', {
        params: {
          blood_group: data.blood_group,
          district: data.district,
          upazila: data.upazila
        }
      });
      setDonors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Search Blood Donors
      </h1>

      {/* Search Form */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-base-200 p-6 rounded-lg shadow"
      >
        {/* Blood Group */}
        <select {...register("blood_group")} className="select select-bordered">
          <option value="">Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        {/* District */}
        <select 
          {...register("district")} 
          className="select select-bordered"
          onChange={(e) => {
            const selected = districts.find(d => d.name === e.target.value);
            setSelectedDistrict(selected);
          }}
        >
          <option value="">District</option>
          {districts.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        {/* Upazila */}
        <select 
          {...register("upazila")} 
          className="select select-bordered"
          disabled={!selectedDistrict}
        >
          <option value="">Upazila</option>
          {selectedDistrict?.upazilas.map(u => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary text-white">
          Search
        </button>
      </form>

      {/* Donor Result Section */}
      <div className="mt-10">
        {!searched && (
          <p className="text-center text-gray-500">
            Please search to see available donors.
          </p>
        )}

        {searched && donors.length === 0 && (
          <p className="text-center text-error">
            No donors found for your search.
          </p>
        )}

        {donors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donors.map(donor => (
              <div key={donor._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-center gap-3">
                    <img 
                      src={donor.photo} 
                      className="w-12 h-12 rounded-full"
                      alt={donor.name}
                    />
                    <div>
                      <h2 className="font-bold">{donor.name}</h2>
                      <p className="text-sm text-gray-500">{donor.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p><strong>Blood:</strong> {donor.blood_group}</p>
                    <p><strong>District:</strong> {donor.district}</p>
                    <p><strong>Upazila:</strong> {donor.upazila}</p>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-secondary">
                      Request Blood
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
