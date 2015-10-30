import unittest
import math
import os

import bond

from buses import get_closest_buses, select_stop_interactive, compute_lat_long_distance,get_nextbus_request
from xml.dom.minidom import parseString

class BusesTests(unittest.TestCase):



    def test_distance_computation(self):
        """
        A test to verify the distance computation.
        The data was verified manually w.r.t. http://andrew.hedges.name/experiments/haversine/
        :return:
        """
        bond.start_test(self) 

        d1 = compute_lat_long_distance(
            dict(lat=38.898, lon=-77.037),
            dict(lat=38.897, lon=-77.043)
        )
        #self.assertEquals(0.330, d1)  # 0.531 km

        d2 = compute_lat_long_distance(
            dict(lat=38.898, lon=-97.030),
            dict(lat=38.890, lon=-97.044)
        )
        #self.assertEquals(0.935, d2) # 1.504 km

        d3 = compute_lat_long_distance(
            dict(lat=38.958, lon=-97.038),
            dict(lat=38.890, lon=-97.044)
        )
        #self.assertEquals(4.712, d3) # 7.581 km
        bond.spy(d1=d1, d2=d2, d3=d3)

    @bond.spy_point(require_agent_result=True, spy_result=True)
    def test_select_stop_0(self):
        bond.start_test(self) 
        bond.deploy_agent('buses.read_console', result=str(1))
        stops=[{'title':'stop1', 'lat':1.000, 'lon':1.000}, {'title':'stop2', 'lat':2.000, 'lon':2.000}]
 

        
        bond.spy(d=select_stop_interactive(stops))




if __name__ == '__main__':
    unittest.main()
