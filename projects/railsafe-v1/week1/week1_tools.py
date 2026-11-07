"""RailSafe Week 1 utilities; route/km crosswalk candidates only, not official assets."""
import re
def parse_km(value):
    m=re.fullmatch(r"\s*(\d+)\s*[Kk]\s*\+\s*(\d{1,3})\s*",str(value))
    return int(m[1])*1000+int(m[2]) if m else None
def overlap_m(a_start,a_end,b_start,b_end):
    if None in (a_start,a_end,b_start,b_end): return 0
    if a_start>a_end or b_start>b_end: raise ValueError("reversed interval")
    return max(0,min(a_end,b_end)-max(a_start,b_start))
def candidate_link(route_a,route_b,a_start,a_end,b_start,b_end):
    return bool(route_a and route_b and route_a==route_b and overlap_m(a_start,a_end,b_start,b_end)>0)
def validate_coordinates(crs):
    if not crs or not str(crs).strip(): raise ValueError("SOURCE_CRS_UNVERIFIED")
    return str(crs).strip()
