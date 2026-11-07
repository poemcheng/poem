"""RailSafe W2: conservative read-only metadata pair screen. No HyP3 submission."""
import csv,sys
from datetime import datetime
REQUIRED=('scene_id','relative_orbit','flight_direction','polarization','beam_mode','acquired_at','frame')
def screen(rows,max_days=48):
    valid=[]
    for r in rows:
        if not all(r.get(k) for k in REQUIRED): continue
        try:t=datetime.fromisoformat(r['acquired_at'].replace('Z','+00:00'))
        except ValueError:continue
        valid.append((r,t))
    pairs=[]
    for i,(a,ta) in enumerate(valid):
        for b,tb in valid[i+1:]:
            same=(a['relative_orbit']==b['relative_orbit'] and a['flight_direction']==b['flight_direction'] and a['frame']==b['frame'] and a['beam_mode']==b['beam_mode']=='IW')
            pol=set(a['polarization'].replace('/',' ').replace(',',' ').split())&set(b['polarization'].replace('/',' ').replace(',',' ').split())&{'VV','HH'}
            days=abs((tb-ta).total_seconds())/86400
            if same and pol and 0<days<=max_days:
                pairs.append((a['scene_id'],b['scene_id'],round(days,2),'MANUAL_BASELINE_REVIEW_REQUIRED'))
    return pairs
if __name__=='__main__':
    with open(sys.argv[1],newline='',encoding='utf-8-sig') as f:rows=list(csv.DictReader(f))
    print('reference,secondary,delta_days,status')
    for x in screen(rows):print(','.join(map(str,x)))
