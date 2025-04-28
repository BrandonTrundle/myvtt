
import { useCallback } from 'react';
import axios from 'axios';
import { STATIC_BASE } from '../../../utils/api';
import { SOCKET_EVENTS } from '../../../constants/SOCKET_EVENTS';

export const useMapUpload = ({ campaignId, campaign, setMapUrl, socket, isGM }) => {
  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('map', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${process.env.REACT_APP_API_BASE}/maps/${campaignId}/map`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data?.activeMap) {
        setMapUrl(`${STATIC_BASE}${res.data.activeMap}`);
        campaign.activeMap = res.data.activeMap;
        if (socket && isGM) {
          socket.emit(SOCKET_EVENTS.MAP_UPDATED, { campaignId, activeMap: res.data.activeMap });
        }
      } else {
        alert('Upload succeeded, but server did not return a valid map. Please try again.');
      }
    } catch {
      alert('Map upload failed. Please check your internet connection or try again.');
    }
  }, [campaignId, campaign, setMapUrl, socket, isGM]);

  return { handleFileUpload };
};
