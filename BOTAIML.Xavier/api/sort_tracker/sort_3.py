"""
As implemented in https://github.com/abewley/sort but with some modifications
"""

from __future__ import print_function
import numpy as np
from api.sort_tracker.kalman_tracker import KalmanBoxTracker
# from correlation_tracker import CorrelationTracker
from api.sort_tracker.data_association import associate_detections_to_trackers
from time import time


class Sort:

  def __init__(self,max_age=20,min_hits=3, use_dlib = False):
    """
    Sets key parameters for SORT
    """
    self.max_age = max_age
    self.min_hits = min_hits
    self.trackers = []
    self.frame_count = 0

    self.use_dlib = use_dlib
    self.track_age = {}
    self.track_start_time = {}
    self.keys_to_pop = []

  def update(self,dets,img=None):
    """
    Params:
      dets - a numpy array of detections in the format [[x,y,w,h,score],[x,y,w,h,score],...]
    Requires: this method must be called once for each frame even with empty detections.
    Returns the a similar array, where the last column is the object ID.

    NOTE: The number of objects returned may differ from the number of detections provided.
    """
    self.frame_count += 1
    #get predicted locations from existing trackers.
    trks = np.zeros((len(self.trackers),5))
    to_del = []
    ret = []
    for t,trk in enumerate(trks):
      pos = self.trackers[t].predict(img) #for kal!
      #print(pos)
      trk[:] = [pos[0], pos[1], pos[2], pos[3], 0]
      if(np.any(np.isnan(pos))):
        to_del.append(t)
    trks = np.ma.compress_rows(np.ma.masked_invalid(trks))
    for t in reversed(to_del):
      self.trackers.pop(t)
    if dets != []:
      matched, unmatched_dets, unmatched_trks = associate_detections_to_trackers(dets,trks)

      #update matched trackers with assigned detections
      for t,trk in enumerate(self.trackers):
        if(t not in unmatched_trks):
          d = matched[np.where(matched[:,1]==t)[0],0]
          trk.update(dets[d,:][0],img) ## for dlib re-intialize the trackers ?!

      #create and initialise new trackers for unmatched detections
      for i in unmatched_dets:
        trk = KalmanBoxTracker(dets[i,:])
            
        # if not self.use_dlib:
        #   trk = KalmanBoxTracker(dets[i,:])
              
        # else:
        #   trk = CorrelationTracker(dets[i,:],img)
        self.trackers.append(trk)

    i = len(self.trackers)
    for trk in reversed(self.trackers):
        if dets == []:
          trk.update([],img)
        d = trk.get_state()
        if((trk.time_since_update < 1) and (trk.hit_streak >= self.min_hits or self.frame_count <= self.min_hits)):
          ret.append(np.concatenate((d,[trk.id+1])).reshape(1,-1)) # +1 as MOT benchmark requires positive
        i -= 1
        #remove dead tracklet
        
          
        if(trk.time_since_update > self.max_age):
          # self.track_age += 1
          self.trackers.pop(i)
    if(len(ret)>0):
      ret = np.concatenate(ret)

      for i in range(len(ret)):
        
        if ret[i][4] in self.track_age:
          self.track_age[ret[i][4]] += 1
        else:
          self.track_age[ret[i][4]] = 1
          self.track_start_time[ret[i][4]] = time()

        
        self.keys_to_pop = []
        
        for key in self.track_age:
          # print(key)
          if key not in ret[i]:
            # self.track_age.pop(key)
            self.keys_to_pop.append(key)
                  
      for key in self.keys_to_pop:
        if self.keys_to_pop.count(key) == len(ret):
          self.track_age.pop(key)
          self.track_start_time.pop(key)

      return ret
    return np.empty((0,5))