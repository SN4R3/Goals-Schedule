module.exports = {
  catsAndGoals(rows) {
    let res = [];
    rows.forEach(row => {
      let exists = false;
      const {
        g_id, g_cid, g_n, g_d, g_t, g_u, g_dl, g_s, g_c_a, g_u_a, //goal's
        id, name, user_id, created_at, updated_at //category's
      } = row
      res.forEach(existing => {
        if (id === existing.id) {
          exists = true;
          existing.goals.push({
            id: g_id,
            category_id: g_cid,
            name: g_n,
            description: g_d,
            target: g_t,
            unit: g_u,
            deadline: g_dl,
            status: g_s,
            created_at: g_c_a,
            updated_at: g_u_a
          });
        }
      });

      if (!exists) {
        let cat = {
          id: id,
          name: name,
          user_id: user_id,
          created_at: created_at,
          updated_at: updated_at,
          goals: []
        };

        cat.goals.push({
          id: g_id,
          category_id: id,
          name: g_n,
          description: g_d,
          target: g_t,
          unit: g_u,
          deadline: g_dl,
          created_at: g_c_a,
          updated_at: g_u_a
        });
        res.push(cat);
      }
    });
    return res;
  },

  goalsAndMilestones(rows) {
    let res = [];
    rows.forEach(row => {
      const {
        g_id, g_cid, g_n, g_d, g_t, g_u, g_dl, g_s, g_c_a, g_u_a, //goal's
        m_id, m_n, m_d, m_t, m_u, m_dl, m_s, m_c_a, m_u_a //milestone's
      } = row;

      let exists = false;
      res.forEach(existing => {
        if (existing.id == g_id) {
          existing.milestones.push({
            id: m_id,
            goal_id: g_id,
            name: m_n,
            description: m_d,
            target: m_t,
            unit: m_u,
            deadline: m_dl,
            status: m_s,
            created_at: m_c_a,
            updated_at: m_u_a
          });
          exists = true;
        }
      });

      if (!exists) {
        let goal = {
          id: g_id,
          category_id: g_cid,
          name: g_n,
          description: g_d,
          target: g_t,
          unit: g_u,
          deadline: g_dl,
          status: g_s,
          created_at: g_c_a,
          updated_at: g_u_a,
          milestones: [],
        };
        //add the milestone to the newly found goal
        let ms = {
          id: m_id,
          goal_id: g_id,
          name: m_n,
          description: m_d,
          target: m_t,
          unit: m_u,
          deadline: m_dl,
          status: m_s,
          created_at: m_c_a,
          updated_at: m_u_a
        }
        if(ms.id)
          goal.milestones.push(ms)
        res.push(goal);
      }
    });
    return res
  },

  cats(rows) {
    let res = [];
    rows.forEach(row => {
      let exists = false;
      const { id, name, user_id, created_at, updated_at } = row
      res.forEach(existing => {
        if (id === existing.id)
          exists = true;
      });

      if (!exists) {
        let cat = {
          id: id,
          name: name,
          user_id: user_id,
          created_at: created_at,
          updated_at: updated_at,
        };
        res.push(cat);
      }
    });
    return res;
  },

  catsGoalsMilestones(rows) {
    let goalsAndMs = this.goalsAndMilestones(rows)
    let res = this.cats(rows)
    
    res.forEach((cat) => {
      cat.goals = []
    });
    goalsAndMs.forEach((gms) => {
      res.forEach((cat) => {
        if(gms.category_id === cat.id) {
          cat.goals.push(gms)
        }
      })
    })

    return res
  }
};
