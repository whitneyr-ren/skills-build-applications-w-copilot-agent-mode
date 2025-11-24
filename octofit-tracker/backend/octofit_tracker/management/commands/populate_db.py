
from django.core.management.base import BaseCommand
from octofit_tracker.models import Team, User, Activity, Workout, Leaderboard
from django.utils import timezone
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):


        # Drop collections directly using PyMongo to avoid Djongo delete issues
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        db['octofit_tracker_team'].drop()
        db['octofit_tracker_user'].drop()
        db['octofit_tracker_activity'].drop()
        db['octofit_tracker_workout'].drop()
        db['octofit_tracker_leaderboard'].drop()
        client.close()

        # Re-create teams
        marvel = Team.objects.create(name='Marvel', description='Marvel superheroes')
        dc = Team.objects.create(name='DC', description='DC superheroes')

        # Re-create users
        spiderman = User.objects.create(name='Spider-Man', email='spiderman@marvel.com', team=marvel)
        ironman = User.objects.create(name='Iron Man', email='ironman@marvel.com', team=marvel)
        wonderwoman = User.objects.create(name='Wonder Woman', email='wonderwoman@dc.com', team=dc)
        batman = User.objects.create(name='Batman', email='batman@dc.com', team=dc)

        # Re-create activities
        Activity.objects.create(user=spiderman, type='Running', duration=30, date=timezone.now().date())
        Activity.objects.create(user=ironman, type='Cycling', duration=45, date=timezone.now().date())
        Activity.objects.create(user=wonderwoman, type='Swimming', duration=60, date=timezone.now().date())
        Activity.objects.create(user=batman, type='Yoga', duration=40, date=timezone.now().date())

        # Re-create workouts
        w1 = Workout.objects.create(name='Hero HIIT', description='High intensity interval training for heroes')
        w2 = Workout.objects.create(name='Power Yoga', description='Yoga for strength and flexibility')
        w1.suggested_for.set([marvel, dc])
        w2.suggested_for.set([dc])

        # Re-create leaderboards
        Leaderboard.objects.create(team=marvel, points=100)
        Leaderboard.objects.create(team=dc, points=120)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
