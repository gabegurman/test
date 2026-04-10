import { Business } from '../types';
import Papa from 'papaparse';

export function exportToCSV(businesses: Business[], filename: string = 'businesses.csv') {
  const data = businesses.map(business => ({
    Name: business.name,
    Address: business.address,
    'Phone Number': business.phoneNumber || '',
    Website: business.website || '',
    Rating: business.rating || '',
    'Number of Ratings': business.userRatings || '',
    Latitude: business.latitude,
    Longitude: business.longitude,
  }));

  const csv = Papa.unparse(data);

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
